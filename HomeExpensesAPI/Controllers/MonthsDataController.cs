using HomeExpensesAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace HomeExpensesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MonthsDataController : ControllerBase
    {
        #region fields
        private readonly HomeExpensesContext _context;
        #endregion
        #region constructors
        public MonthsDataController(HomeExpensesContext context)
        {
            _context = context;
        }
        #endregion
        #region Methods
        [HttpGet("GetListOfMonth")]
        public IActionResult GetListOfMonths() 
        { 
            var monthList = (from x in _context.MonthsData group x by new
            {
                monthYear = x.MonthYear,
                monthNumber = x.MonthNumber,
            } into monthsGroup 
            orderby monthsGroup.Key.monthYear.Length ascending,
            monthsGroup.Key.monthYear ascending,
            monthsGroup.Key.monthNumber.Length ascending,
            monthsGroup.Key.monthNumber ascending 
            select monthsGroup.Key).ToList();
            return Ok(monthList);
        }

        [HttpGet("GetTableData")]
        public IActionResult GetTableData(string monthYear, string monthNumber, string tableName) 
        {
            var tableData = (from x in _context.MonthsData
                             where x.MonthYear == monthYear && x.MonthNumber == monthNumber && x.TableName == tableName
                             select new
                             {
                                 id = x.Id,
                                 date = x.Date,
                                 name = x.Name,
                                 amount = x.Amount
                             }).ToList();
            return Ok(tableData);
        }
        [HttpPost("InsertTableRow")]
        public IActionResult InsertTableRow(MonthsData data)
        {
            _context.MonthsData.Add(data);
            _context.SaveChanges();
            var id = _context.MonthsData.OrderByDescending(p => p.Id).FirstOrDefault().Id;
            return Ok(id);
        }
        [HttpDelete("DeleteTableRow/{id}")]
        public IActionResult DeleteTableRow(int id)
        {
            var x = _context.MonthsData.Where(item => item.Id == id).FirstOrDefault();
            _context.MonthsData.Remove(x);  
            _context.SaveChanges();
            return Ok("Success");
        }
        #endregion
    }
}
