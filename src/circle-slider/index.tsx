import React, { MutableRefObject, RefObject, useRef } from "react";
import { buildPath, polarToCartesian } from "./helpers";

type Props = {
    value?: number;
    size?: number;
    stepSize?: number;
    min?: number;
    max?: number;
    circleWidth?: number;
    circleColor?: string;
    progressWidth?: number;
    progressColor?: string;
    knobColor?: string;
    knobRadius?: number;
    disabled?: boolean;
    shadow?: boolean;
    showTooltip?: boolean;
    valuePrefix?: string;
    valueSuffix?: string;
    tooltipSize?: number;
    tooltipColor?: string;
    onChange: (value?: number) => void;
    className?: string;
};

const THRESHOLD = 0.01;

const CircleSlider: React.FC<Props> = ({
    value = 0,
    size = 180,
    stepSize = 1,
    min = 0,
    max = 100,
    circleWidth = 5,
    circleColor = "#e9eaee",
    progressWidth = 10,
    progressColor = "#007aff",
    knobColor = "#e9eaee",
    knobRadius = 10,
    disabled = false,
    shadow = true,
    showTooltip = false,
    valuePrefix = "",
    valueSuffix = "",
    tooltipSize = 32,
    tooltipColor = "#333",
    onChange,
    className,
}) => {
    // takes care of min, max and stepSize
    const formatValue = (input?: number) => Math.round((input || (value < min ? min : value > max ? max : value)) / stepSize) * stepSize;

    const valueToAngle = () => {
        const newAngle = Math.round(((formatValue() - min) / (max - min)) * 360);
        return newAngle === 360 ? newAngle - THRESHOLD : newAngle % 360;
    };

    const angleToValue = (newAngle: number) => formatValue(newAngle / (360 / (max - min))) + min;

    const svgRef = useRef<SVGSVGElement>() as RefObject<SVGSVGElement>;
    const prevX = useRef<number>() as MutableRefObject<number>; // necessary since functional component

    const updateSliderFromEvent = (event: MouseEvent | Touch) => {
        const rectSize = svgRef.current!.getBoundingClientRect();
        const rectCenter = rectSize.width / 2;

        const x = event.clientX - rectSize.left - rectCenter;
        const y = event.clientY - rectSize.top - rectCenter;
        const angleBetweenTwoVectors = Math.atan2(y, x);

        let newAngle = Math.round((angleBetweenTwoVectors * 180) / Math.PI) + 90;

        if (x < 0 && y < 0) {
            newAngle += 360;
        }

        // prevent jumping from "< 360 to > 0" and "> 0 to < 360"
        if (y < 0) {
            if (prevX.current < 0 && x > 0) {
                newAngle = 360 - THRESHOLD; // can't go over 360
            } else if (prevX.current > 0 && x < 0) {
                newAngle = THRESHOLD; // can't go lower than 0
            } else {
                prevX.current = x;
            }
        } else {
            prevX.current = x;
        }

        onChange(angleToValue(newAngle));
    };

    // mouse event handlers
    // --------------------
    // react event
    const handleMouseDown = (event: React.MouseEvent) => {
        event.preventDefault();
        svgRef.current!.addEventListener("mousemove", handleMouseMove);
        svgRef.current!.addEventListener("mouseup", handleMouseUp);
    };

    // regular dom event
    const handleMouseMove = (event: MouseEvent) => {
        event.preventDefault();
        updateSliderFromEvent(event);
    };

    // regular dom event
    const handleMouseUp = (event: MouseEvent) => {
        event.preventDefault();
        svgRef.current!.removeEventListener("mousemove", handleMouseMove);
        svgRef.current!.removeEventListener("mouseup", handleMouseUp);
    };

    // touch event handlers
    // --------------------
    // react event
    const handleTouchStart = () => {
        svgRef.current!.addEventListener("touchmove", handleTouchMove);
        svgRef.current!.addEventListener("touchend", handleTouchUp);
    };

    // regular dom event
    const handleTouchMove = (event: TouchEvent) => {
        const targetTouches = event.targetTouches;
        const currentTouch = targetTouches.item(targetTouches.length - 1);
        if (currentTouch) {
            updateSliderFromEvent(currentTouch);
        }
    };

    // regular dom event
    const handleTouchUp = () => {
        svgRef.current!.removeEventListener("touchmove", handleTouchMove);
        svgRef.current!.removeEventListener("touchend", handleTouchUp);
    };

    const center = size / 2;
    // if there is a shadow we need to draw a bit smaller to not cut if off
    const radius = center - Math.max(circleWidth, progressWidth, knobRadius * 2) / 2 - (shadow ? 10 : 0);
    const progressPath = buildPath({
        cx: center,
        cy: center,
        radius: radius + progressWidth / 2,
        startAngle: 0,
        endAngle: valueToAngle(),
        thickness: progressWidth,
    });
    const knobCenter = polarToCartesian(center, center, radius, valueToAngle());

    return (
        <svg
            ref={svgRef}
            className={className}
            height={size}
            width={size}
            viewBox={`0 0 ${size} ${size}`}
            onMouseDown={disabled ? undefined : handleMouseDown}
            onTouchStart={disabled ? undefined : handleTouchStart}
            style={{
                boxSizing: "border-box",
                touchAction: "none",
            }}
        >
            <circle
                style={{
                    fill: "none",
                    stroke: circleColor,
                    strokeWidth: circleWidth,
                }}
                r={radius}
                cx={center}
                cy={center}
            />

            <path
                style={{
                    fill: progressColor,
                    fillRule: "evenodd",
                    stroke: "none",
                }}
                d={progressPath}
            />

            {shadow && (
                <filter id="dropShadow" filterUnits="userSpaceOnUse">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feOffset dx="2" dy="2" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            )}
            <circle
                style={{
                    cursor: disabled ? "not-allowed" : "pointer",
                    fill: knobColor,
                }}
                filter={shadow ? "url(#dropShadow)" : "none"}
                r={knobRadius}
                cx={knobCenter.x}
                cy={knobCenter.y}
            />

            {showTooltip && (
                <text
                    x={size / 2}
                    y={size / 2 + tooltipSize / 3}
                    textAnchor="middle"
                    fontSize={tooltipSize}
                    fontFamily="Arial"
                    fill={tooltipColor}
                >
                    {valuePrefix}
                    {formatValue()}
                    {valueSuffix}
                </text>
            )}
        </svg>
    );
};

export default CircleSlider;
