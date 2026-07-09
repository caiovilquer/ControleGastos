using ControleGastos.Api.Data;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Tests.Helpers;

// Cria um AppDbContext real sobre SQLite in-memory, para exercitar
// constraints e cascade delete de verdade em vez de mockar o DbContext.
public class TestDbContextFactory : IDisposable
{
    private readonly SqliteConnection _connection;

    public AppDbContext DbContext { get; }

    public TestDbContextFactory()
    {
        // O banco ":memory:" do SQLite só existe enquanto a conexão que o
        // criou permanecer aberta; por isso ela é mantida viva aqui.
        _connection = new SqliteConnection("Data Source=:memory:");
        _connection.Open();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(_connection)
            .Options;

        DbContext = new AppDbContext(options);
        DbContext.Database.EnsureCreated();
    }

    public void Dispose()
    {
        DbContext.Dispose();
        _connection.Dispose();
    }
}
