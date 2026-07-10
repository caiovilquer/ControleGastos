using ControleGastos.Api.DTOs;
using FluentValidation;

namespace ControleGastos.Api.Validators;

public class CriarTransacaoRequestValidator : AbstractValidator<CriarTransacaoRequest>
{
    public CriarTransacaoRequestValidator()
    {
        RuleFor(x => x.PessoaId)
            .GreaterThan(0);

        RuleFor(x => x.Descricao)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Valor)
            .GreaterThan(0);

        RuleFor(x => x.Tipo)
            .IsInEnum();
    }
}
