using Microsoft.EntityFrameworkCore;

namespace HomeExpensesAPI.Models
{
    public class HomeExpensesContext:DbContext
    {
        public HomeExpensesContext(DbContextOptions<HomeExpensesContext> options) : base(options)
        { }
        // this will disable on delete cascade on all foreign keys, which is by default.
        protected override void OnModelCreating(ModelBuilder modelbuilder)
        {
            base.OnModelCreating(modelbuilder);
            foreach (var fkey in modelbuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                fkey.DeleteBehavior = DeleteBehavior.Restrict;
            }

        }
        public DbSet<MonthsData> MonthsData { get; set; }
    }
}
