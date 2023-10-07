export class CelestialBody {
  name: string;
  smA: number;
  oI: number;
  aP: number;
  oE: number;
  aN: number;
  mAe: number;
  sidereal: number

  constructor(name: string, smA: number, oI: number, aP: number, oE: number, aN: number, mAe: number, sidereal: number) {
    this.name = name;
    this.smA = smA;
    this.oI = oI;
    this.aP = aP;
    this.oE = oE;
    this.aN = aN;
    this.mAe = mAe;
    this.sidereal = sidereal;
  }
}