using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Data;

// Dados de demonstração para reduzir o atrito de avaliação do desafio.
public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        // Seed idempotente: só popula um banco vazio, para não duplicar
        // dados a cada reinício da aplicação.
        if (await db.Pessoas.AnyAsync())
        {
            return;
        }

        var ana = new Pessoa { Nome = "Ana Souza", Idade = 42 };
        var carlos = new Pessoa { Nome = "Carlos Lima", Idade = 35 };
        // Dois menores de propósito: regra de negócio (só despesas) + insight
        // no Totais com o conectivo "e" na lista de nomes.
        var marina = new Pessoa { Nome = "Marina Alves", Idade = 16 };
        var pedro = new Pessoa { Nome = "Pedro Santos", Idade = 28 };
        var julia = new Pessoa { Nome = "Julia Rocha", Idade = 31 };
        var cain = new Pessoa { Nome = "Cain Oliveira", Idade = 14 };

        // Exatamente 6 pessoas: o gráfico de totais usa barras verticais até
        // 6 e troca para horizontais a partir da 7ª
        db.Pessoas.AddRange(ana, carlos, marina, pedro, julia, cain);
        await db.SaveChangesAsync();

        db.Transacoes.AddRange(
            // Ana: saldo positivo.
            new Transacao { PessoaId = ana.Id, Descricao = "Salário", Valor = 5500.00m, Tipo = TipoTransacao.Receita },
            new Transacao { PessoaId = ana.Id, Descricao = "Freela projeto X", Valor = 800.50m, Tipo = TipoTransacao.Receita },
            new Transacao { PessoaId = ana.Id, Descricao = "Aluguel", Valor = 1800.00m, Tipo = TipoTransacao.Despesa },
            new Transacao { PessoaId = ana.Id, Descricao = "Mercado", Valor = 620.75m, Tipo = TipoTransacao.Despesa },

            // Carlos: saldo negativo (despesas maiores que a receita).
            new Transacao { PessoaId = carlos.Id, Descricao = "Salário", Valor = 2200.00m, Tipo = TipoTransacao.Receita },
            new Transacao { PessoaId = carlos.Id, Descricao = "Aluguel", Valor = 1800.00m, Tipo = TipoTransacao.Despesa },
            new Transacao { PessoaId = carlos.Id, Descricao = "Mercado", Valor = 600.00m, Tipo = TipoTransacao.Despesa },

            // Marina: menor de idade, apenas despesas.
            new Transacao { PessoaId = marina.Id, Descricao = "Mercado", Valor = 45.90m, Tipo = TipoTransacao.Despesa },
            new Transacao { PessoaId = marina.Id, Descricao = "Transporte", Valor = 60.00m, Tipo = TipoTransacao.Despesa },

            // Pedro: receita e despesa, saldo positivo.
            new Transacao { PessoaId = pedro.Id, Descricao = "Freela", Valor = 1200.00m, Tipo = TipoTransacao.Receita },
            new Transacao { PessoaId = pedro.Id, Descricao = "Mercado", Valor = 380.25m, Tipo = TipoTransacao.Despesa },

            // Julia: saldo positivo moderado.
            new Transacao { PessoaId = julia.Id, Descricao = "Salário", Valor = 4100.00m, Tipo = TipoTransacao.Receita },
            new Transacao { PessoaId = julia.Id, Descricao = "Condomínio", Valor = 750.00m, Tipo = TipoTransacao.Despesa },
            new Transacao { PessoaId = julia.Id, Descricao = "Internet", Valor = 119.90m, Tipo = TipoTransacao.Despesa },

            // Cain: menor de idade, apenas despesas.
            new Transacao { PessoaId = cain.Id, Descricao = "Lanche", Valor = 28.50m, Tipo = TipoTransacao.Despesa },
            new Transacao { PessoaId = cain.Id, Descricao = "Material escolar", Valor = 95.00m, Tipo = TipoTransacao.Despesa }
        );

        await db.SaveChangesAsync();
    }
}
