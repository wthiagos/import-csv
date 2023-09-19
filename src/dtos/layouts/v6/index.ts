import {InclusaoGrupoFamiliarDTO} from "./inclusaoGrupoFamiliarDTO";
import {InclusaoDependenteDTO} from "./inclusaoDependenteDTO";
import {AlteracaoTitularDTO} from "./alteracaoTitularDTO";
import {AlteracaoDependenteDTO} from "./alteracaoDependenteDTO";
import {ExclusaoDTO} from "./exclusaoDTO";
import {SolicitacaoSegundaViaCartaoDTO} from "./solicitacaoSegundaViaCartaoDTO";
import {TransferenciaDTO} from "./transferenciaDTO";

export interface V6DTO {
    inclusaoGrupoFamiliar: InclusaoGrupoFamiliarDTO[];
    inclusaoDependente: InclusaoDependenteDTO[];
    alteracaoTitular: AlteracaoTitularDTO[];
    alteracaoDependente: AlteracaoDependenteDTO[];
    exclusao: ExclusaoDTO[];
    solicitacaoSegundaViaCartao: SolicitacaoSegundaViaCartaoDTO[];
    transferencia: TransferenciaDTO[];
}