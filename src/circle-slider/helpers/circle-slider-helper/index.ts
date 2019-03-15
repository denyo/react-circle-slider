export class CircleSliderHelper {
    private stepsArray: number[];
    private stepIndex: number;
    private countSteps: number;

    constructor(stepsArray: number[], initialValue: number) {
        this.stepsArray = stepsArray;
        this.countSteps = this.stepsArray.length - 1;
        this.stepIndex = 0;
        this.setCurrentStepIndexFromArray(initialValue);
    }

    public getCurrentStep(): number {
        return this.stepsArray[this.stepIndex];
    }

    public updateStepIndexFromValue(value: number) {
        const isSetValue = this.setCurrentStepIndexFromArray(value);
        if (isSetValue) {
            return;
        }
        this.stepIndex = this.countSteps;
    }

    public updateStepIndexFromAngle(angle: number) {
        const stepIndex = Math.round(angle / this.getAnglePoint());
        if (stepIndex < this.countSteps) {
            this.stepIndex = stepIndex;
            return;
        }
        this.stepIndex = this.countSteps;
    }

    public setCurrentStepIndexFromArray = (value: number): boolean => {
        for (let i = 0; i < this.countSteps; i++) {
            if (value <= this.stepsArray[i]) {
                this.stepIndex = i;
                return true;
            }
        }
        this.stepIndex = this.countSteps;
        return false;
    };

    public getAnglePoint(): number {
        return 360 / this.countSteps;
    }
}
