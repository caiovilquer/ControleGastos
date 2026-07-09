using ControleGastos.Api.Data;
using ControleGastos.Api.DTOs;
using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Services;

public class TotaisService : ITotaisService
{
    private readonly AppDbContext _dbContext;

    public TotaisService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<TotaisGeralResponse> ObterTotaisAsync(CancellationToken cancellationToken)
    {
        // O cálculo dos totais é responsabilidade do backend — o frontend
        // apenas exibe o resultado. AsNoTracking porque é leitura.
        //
        // O provider SQLite do EF Core não traduz SUM sobre "decimal" para
        // SQL (o tipo é armazenado como TEXT), então trazemos apenas as
        // colunas necessárias (PessoaId, Valor, Tipo) e agregamos em
        // memória via LINQ, em vez de usar Sum()/GroupBy() no IQueryable.
        var pessoas = await _dbContext.Pessoas
            .AsNoTracking()
            .Select(p => new { p.Id, p.Nome })
            .ToListAsync(cancellationToken);

        var transacoes = await _dbContext.Transacoes
            .AsNoTracking()
            .Select(t => new { t.PessoaId, t.Valor, t.Tipo })
            .ToListAsync(cancellationToken);

        var totaisPorPessoa = pessoas
            .Select(p =>
            {
                var transacoesDaPessoa = transacoes.Where(t => t.PessoaId == p.Id);
                var totalReceitas = transacoesDaPessoa.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor);
                var totalDespesas = transacoesDaPessoa.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor);

                return new TotaisPessoaResponse
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    TotalReceitas = totalReceitas,
                    TotalDespesas = totalDespesas,
                    // Saldo pode ser negativo (despesas maiores que receitas);
                    // isso não é um erro, apenas o resultado do cálculo.
                    Saldo = totalReceitas - totalDespesas
                };
            })
            .ToList();

        var totalGeralReceitas = totaisPorPessoa.Sum(p => p.TotalReceitas);
        var totalGeralDespesas = totaisPorPessoa.Sum(p => p.TotalDespesas);

        return new TotaisGeralResponse
        {
            Pessoas = totaisPorPessoa,
            TotalReceitas = totalGeralReceitas,
            TotalDespesas = totalGeralDespesas,
            Saldo = totalGeralReceitas - totalGeralDespesas
        };
    }
}
