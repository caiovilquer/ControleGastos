using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using ControleGastos.Api.Services;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Tests;

// Prova, via SQLite in-memory, que o cascade delete configurado em
// AppDbContext (OnDelete(DeleteBehavior.Cascade)) remove as transações
// de uma pessoa quando ela é excluída — regra de negócio do desafio.
public class PessoaServiceTests : IDisposable
{
    private readonly SqliteConnection _connection;
    private readonly AppDbContext _dbContext;

    public PessoaServiceTests()
    {
        // A conexão precisa ficar aberta durante todo o teste: fechar a
        // única conexão de um banco ":memory:" descarta o banco inteiro.
        _connection = new SqliteConnection("Data Source=:memory:");
        _connection.Open();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(_connection)
            .Options;

        _dbContext = new AppDbContext(options);
        _dbContext.Database.EnsureCreated();
    }

    [Fact]
    public async Task ExcluirAsync_DeveRemoverTransacoesVinculadas_QuandoPessoaEExcluida()
    {
        var pessoa = new Pessoa { Nome = "Ana", Idade = 25 };
        _dbContext.Pessoas.Add(pessoa);
        await _dbContext.SaveChangesAsync();

        _dbContext.Transacoes.Add(new Transacao
        {
            PessoaId = pessoa.Id,
            Descricao = "Salário",
            Valor = 1000m,
            Tipo = TipoTransacao.Receita
        });
        await _dbContext.SaveChangesAsync();

        Assert.Equal(1, await _dbContext.Transacoes.CountAsync());

        var service = new PessoaService(_dbContext);
        await service.ExcluirAsync(pessoa.Id, CancellationToken.None);

        Assert.Equal(0, await _dbContext.Transacoes.CountAsync());
        Assert.Equal(0, await _dbContext.Pessoas.CountAsync());
    }

    public void Dispose()
    {
        _dbContext.Dispose();
        _connection.Dispose();
    }
}
