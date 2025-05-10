namespace MosaicImageWebApp.Services
{
    // <summary>
    // This service should be used to handle color-related operations.
    // </summary>
    public static class ColorService
    {
        public static List<string> GetPresetColorsAsync(int numColors = 10)
        {
            var colors = new List<string>();
            var random = new Random(); // Make sure this is out of the loop!
            for (int i = 0; i < numColors; i++)
            {
                colors.Add($"#{random.Next(0x1000000):X6}");
            }
            return colors;
        }
    }
}
