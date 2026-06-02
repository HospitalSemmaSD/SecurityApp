namespace SecApp.Api.DTOs.CommonDTOs
{
    public class PaginationDTO
    {
        public int Page { get; set; } = 1;
        private int _recordsPerPage = 10;
        private int _maxRecordsPerPage = 25;

        public int RecordsPerPage
        {
            get => _recordsPerPage;
            set => _recordsPerPage = value > _maxRecordsPerPage ? _maxRecordsPerPage : value;
        }
    }
}
