namespace Backend.DTOs
{
    public class RepositoryResponse
    {
        public object _data { get; set; }
        public string _error { get; set; }
        public RepositoryResponse(object data = null, string error = "")
        {
            data = data;
            error = error;
        }
    }
}
