import {Patient} from "../models/patient";
import dummyData from "../services/dummyDatabase.json"

export class DummyMethods {
  static getAllPatients() : Array<Patient> {
    return dummyData.patients;
  }
}
