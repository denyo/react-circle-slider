import { mount, shallow } from "enzyme";
import React from "react";
import { CircleSlider } from "../circle-slider";

describe("circle slider", () => {
    const props = {
        circleColor: "#EDEDED",
        size: 100,
        value: 0,
        progressColor: "#ADA1FB",
        knobColor: "#ADA1FB",
        circleWidthInit: 9,
        progressWidthInit: 7,
        knobRadiusInit: 6,
        stepSize: 1,
        min: 0,
        max: 100,
        onChange: jest.fn(),
    };

    it("circle slider should render a svg", () => {
        const wrapper = shallow(<CircleSlider {...props} />);

        expect(wrapper.find("svg")).toHaveLength(1);
    });

    it("circle slider should render with props", () => {
        const wrapper = mount(<CircleSlider {...props} />);

        expect(wrapper.props().circleColor).toEqual("#EDEDED");
        expect(wrapper.props().value).toEqual(0);
        expect(wrapper.props().progressColor).toEqual("#ADA1FB");
        expect(wrapper.props().knobColor).toEqual("#ADA1FB");
        expect(wrapper.props().circleWidthInit).toEqual(9);
        expect(wrapper.props().progressWidthInit).toEqual(7);
        expect(wrapper.props().knobRadiusInit).toEqual(6);
        expect(wrapper.props().stepSize).toEqual(1);
        expect(wrapper.props().min).toEqual(0);
        expect(wrapper.props().max).toEqual(100);
    });

    it("circle slider should call onChange on mousemove", () => {
        const wrapper = mount(<CircleSlider {...props} />);
        const simulateDrag = (eventOpts: { clientX: number; clientY: number }) => {
            wrapper.simulate("mousedown", {
                preventDefault: () => {},
            });
            wrapper.getDOMNode().dispatchEvent(new MouseEvent("mousemove", eventOpts));
            wrapper.simulate("mouseup", {
                preventDefault: () => {},
            });
        };

        simulateDrag({ clientX: 10, clientY: 10 });
        expect(props.onChange).toHaveBeenCalledTimes(1);

        simulateDrag({ clientX: 20, clientY: 20 });
        expect(props.onChange).toHaveBeenCalledTimes(2);
    });

    it("should render a default circle slider", () => {
        const wrapper = shallow(<CircleSlider {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});
