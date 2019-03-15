export class MouseHelper {
    private container: SVGSVGElement;
    private center!: number;
    private relativeX!: number;
    private relativeY!: number;

    constructor(container: SVGSVGElement) {
        this.container = container;
    }

    public setPosition(event: MouseEvent | React.Touch): void {
        if (!this.container) {
            return;
        }
        const rectSize = this.container.getBoundingClientRect();
        this.center = rectSize.width / 2;
        this.relativeX = event.clientX - rectSize.left;
        this.relativeY = event.clientY - rectSize.top;
    }

    public getNewSliderAngle(): number {
        const x = this.relativeX - this.center;
        const y = this.relativeY - this.center;
        const angleBetweenTwoVectors = Math.atan2(y, x);

        let angle = (angleBetweenTwoVectors * 180) / Math.PI + 90;
        if (x < 0 && y < 0) {
            angle += 360;
        }
        return angle;
    }
}
