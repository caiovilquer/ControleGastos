using ControleGastos.Api.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace ControleGastos.Tests.Helpers;

// Sobe a API real via WebApplicationFactory, trocando só o banco por
// SQLite in-memory. Assim os testes HTTP exercitam pipeline completo
// (controllers, FluentValidation, exception handler, serialização JSON)
// sem depender de arquivo em disco nem do seed de Development.
public class ControleGastosWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly SqliteConnection _connection = new("Data Source=:memory:");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        _connection.Open();

        // "Testing" evita o seed de Development e mantém o foco no
        // comportamento da API (sem depender de dados de demonstração).
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            services.RemoveAll(typeof(DbContextOptions<AppDbContext>));
            services.RemoveAll(typeof(AppDbContext));

            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlite(_connection));
        });
    }

    // Limpa as tabelas entre testes sem recriar a conexão in-memory
    // (EnsureDeleted fecharia o banco :memory: compartilhado).
    public async Task ResetDatabaseAsync()
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Transacoes.RemoveRange(db.Transacoes);
        db.Pessoas.RemoveRange(db.Pessoas);
        await db.SaveChangesAsync();
    }

    protected override void Dispose(bool disposing)
    {
        if (disposing)
        {
            _connection.Dispose();
        }

        base.Dispose(disposing);
    }
}
