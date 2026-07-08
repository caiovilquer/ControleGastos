namespace ControleGastos.Api.Models;

public class Transacao
{
    public int Id { get; set; }

    public int PessoaId { get; set; }

    public string Descricao { get; set; } = string.Empty;

    // decimal é obrigatório (não double/float) para valores monetários:
    // evita erros de arredondamento de ponto flutuante binário.
    public decimal Valor { get; set; }

    public TipoTransacao Tipo { get; set; }

    public Pessoa? Pessoa { get; set; }
}
