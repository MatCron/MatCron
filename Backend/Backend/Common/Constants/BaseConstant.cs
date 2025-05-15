using Newtonsoft.Json;

namespace Backend.Common.Constants
{
    public class BaseConstant
    {
        public static JsonSerializerSettings jsonSettings = new JsonSerializerSettings
        {
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore, // Ignore circular references
            Formatting = Formatting.Indented
        };
    }
}
