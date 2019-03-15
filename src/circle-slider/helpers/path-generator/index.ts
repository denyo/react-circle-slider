export function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
}

export function getPath({
    cx,
    cy,
    radius,
    startAngle,
    endAngle,
    thickness,
}: {
    cx: number;
    cy: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    thickness: number;
}) {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const cutoutRadius = radius - thickness;
    const start2 = polarToCartesian(cx, cy, cutoutRadius, endAngle);
    const end2 = polarToCartesian(cx, cy, cutoutRadius, startAngle);

    return [
        "M",
        start.x,
        start.y,
        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,
        "L",
        cx,
        cy,
        "Z",
        "M",
        start2.x,
        start2.y,
        "A",
        cutoutRadius,
        cutoutRadius,
        0,
        largeArcFlag,
        0,
        end2.x,
        end2.y,
        "L",
        cx,
        cy,
        "Z",
    ].join(" ");
}
