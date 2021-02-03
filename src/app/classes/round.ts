export class Round {
  point: number;
  amount: number;
  isPlanDone: boolean;
  isWorkDone: boolean;
  constructor(
    public roundID: number,
    baseAmount: number) {
      this.amount = baseAmount;
      this.point = 0;
      if(roundID === 1) {
        this.point = 20;
      }
      this.isPlanDone = false;
      this.isWorkDone = false;
  }
}
