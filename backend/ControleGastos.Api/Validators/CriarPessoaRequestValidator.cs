using ControleGastos.Api.DTOs;
using FluentValidation;

namespace ControleGastos.Api.Validators;

public class CriarPessoaRequestValidator : AbstractValidator<CriarPessoaRequest>
{
    public CriarPessoaRequestValidator()
    {
        RuleFor(x => x.Nome)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Idade)
            .GreaterThanOrEqualTo(0)
            .LessThanOrEqualTo(130);
    }
}
