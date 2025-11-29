interface IndicatorProp {
  colour: number;
  name: string;
  counter: number;
}

export const ProjectIndicator = ({ colour, name, counter }: IndicatorProp) => {
  return (
    <div>
      {colour} {name} {counter}
    </div>
  );
};
