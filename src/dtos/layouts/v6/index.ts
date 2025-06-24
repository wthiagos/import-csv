import { AlteracaoDependenteDTO } from "./alteracaoDependenteDTO.js";
import { AlteracaoTitularDTO } from "./alteracaoTitularDTO.js";
import { ExclusaoDTO } from "./exclusaoDTO.js";
import { InclusaoDependenteDTO } from "./inclusaoDependenteDTO.js";
import { InclusaoGrupoFamiliarDTO } from "./inclusaoGrupoFamiliarDTO.js";
import { SolicitacaoSegundaViaCartaoDTO } from "./solicitacaoSegundaViaCartaoDTO.js";
import { TransferenciaDTO } from "./transferenciaDTO.js";

export interface V6DTO {
    inclusaoGrupoFamiliar: InclusaoGrupoFamiliarDTO[];
    inclusaoDependente: InclusaoDependenteDTO[];
    alteracaoTitular: AlteracaoTitularDTO[];
    alteracaoDependente: AlteracaoDependenteDTO[];
    exclusao: ExclusaoDTO[];
    solicitacaoSegundaViaCartao: SolicitacaoSegundaViaCartaoDTO[];
    transferencia: TransferenciaDTO[];
}