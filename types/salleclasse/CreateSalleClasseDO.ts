export type CreateSalleClasseDO = {
    etablissement_scolaire_id : string;
    annee_scolaire_id         : string;
    classe_id                 : string;
    code                      : string;
    description               : string|null;
    notes                     : string|null;
    created_by                : string;
}