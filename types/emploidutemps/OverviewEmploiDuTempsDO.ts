
export type OverviewElementEmploiDuTempsDO = {
    jour            : string;
    matiere         : string|null;
    enseignant      : string|null;
    description     : string|null;
    start_time      : string;
    end_time        : string;
}

export type OverviewEmploiDuTempsDO = {
    salle_classe_code : string;
    elements : OverviewElementEmploiDuTempsDO[];
}
