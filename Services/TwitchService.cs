using Microsoft.Extensions.Options;
using MosaicImageWebApp.Models;
using System.Net.Http.Headers;
using System.Text.Json;

namespace MosaicImageWebApp.Services
{
    public class TwitchService
    {
        private readonly HttpClient _http;
        private readonly TwitchOptions _options;
        private string? _accessToken;

        public TwitchService(IOptions<TwitchOptions> options, HttpClient http)
        {
            _options = options.Value;
            _http = http;
        }

        public async Task<string?> GetAccessTokenAsync()
        {
            if (!string.IsNullOrEmpty(_accessToken)) return _accessToken;

            var content = new FormUrlEncodedContent(
            [
                new KeyValuePair<string, string>("client_id", _options.ClientId),
                new KeyValuePair<string, string>("client_secret", _options.ClientSecret),
                new KeyValuePair<string, string>("grant_type", "client_credentials")
            ]);

            var response = await _http.PostAsync("https://id.twitch.tv/oauth2/token", content);
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            var doc = JsonDocument.Parse(json);
            _accessToken = doc.RootElement.GetProperty("access_token").GetString();
            return _accessToken;
        }

        private async Task<HttpRequestMessage> CreateTwitchRequest(HttpMethod method, string url)
        {
            var token = await GetAccessTokenAsync();
            var request = new HttpRequestMessage(method, url);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            request.Headers.Add("Client-ID", _options.ClientId);
            return request;
        }

        public async Task<string?> GetUserProfileImageAsync(string username)
        {
            var request = await CreateTwitchRequest(HttpMethod.Get, $"https://api.twitch.tv/helix/users?login={username}");
            var response = await _http.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            var doc = JsonDocument.Parse(json);
            var user = doc.RootElement.GetProperty("data")[0];
            return user.GetProperty("profile_image_url").GetString();
        }

        public async Task<string?> GetBroadcasterIdAsync(string username)
        {
            var request = await CreateTwitchRequest(HttpMethod.Get, $"https://api.twitch.tv/helix/users?login={username}");
            var response = await _http.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            var doc = JsonDocument.Parse(json);
            var user = doc.RootElement.GetProperty("data")[0];
            return user.GetProperty("id").GetString();
        }

        public async Task<List<string>> GetChannelEmotesAsync(string broadcasterId)
        {
            return await GetAsync($"https://api.twitch.tv/helix/chat/emotes?broadcaster_id={broadcasterId}");
        }

        public async Task<List<string>> GetGlobalEmotesAsync()
        {
            return await GetAsync($"https://api.twitch.tv/helix/chat/emotes/global");
        }

        private async Task<List<string>> GetAsync(string url)
        {
            var request = await CreateTwitchRequest(HttpMethod.Get, url);
            var response = await _http.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            var doc = JsonDocument.Parse(json);
            var emotes = doc.RootElement.GetProperty("data");
            return [.. emotes.EnumerateArray().Select(e => e.GetProperty("images").GetProperty("url_4x").GetString()!)];
        }
    }
}
