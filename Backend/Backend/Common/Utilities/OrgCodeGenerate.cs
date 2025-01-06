namespace Backend.Common.Utilities
{
    public class OrgCodeGenerate
    {
        public static string GenerateOrgCode(string name,int index)
        {
            string code = name.Substring(0, 3).ToUpper();
            code += index;
            return code;
        }
    }
}
