import {Patient} from "../models/patient";

export class DummyMethods {

  static emptyPatient: Patient = {patientenID: -1, plz:"", name: "", geschlecht: "", blutgruppe: "", geburtsdatum: new Date(), adresse: "", kontakttelefon: "", verstorben: false, krankenversicherungsnummer: "", gewicht: 0, krankenkassenstatus: ""};

}
