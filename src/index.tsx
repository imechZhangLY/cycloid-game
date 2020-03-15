/**
 * @file 入口文件
 * @author zhangluyao01
 */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import {Line} from './model/Line';
import {MultiLine} from './model/MultiLine';

import './index.css';

const Handle = Slider.Handle;
const parameters = [
    {
        title: 'vx0:',
        defaultValue: 1
    },
    {
        title: 'vx1:',
        defaultValue: 0
    },
    {
        title: 'vx2:',
        defaultValue: 0
    },
    {
        title: 'vy0:',
        defaultValue: 0
    },
    {
        title: 'vy1:',
        defaultValue: 0
    },
    {
        title: 'vy2:',
        defaultValue: 0
    }
]

interface StateInterface {
    width: number;
    height: number;
    ratio: number;
    parameters: {
        title: string;
        defaultValue: number;
    }[]
}

class App extends React.PureComponent<{}, StateInterface> {
    canvas: HTMLCanvasElement;
    points1: [number, number][];
    points2: [number, number][];
    line: Line;
    multiLine: MultiLine;
    req: number;
    radius: number;
    scale: number;
    parameters: number[];
    center: number[];

    constructor(props: {}) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            ratio: window.innerWidth / window.innerHeight,
            parameters
        };
        this.points1 = [];
        this.points2 = [];
        this.radius = 0.5;
        this.scale = 1;
        this.parameters = [1, 0, 0, 0, 0, 0];
        this.center = [this.radius - this.state.ratio, 0];
    }

    render() {
        return (
            <div>
                <canvas
                    width={this.state.width}
                    height={this.state.height}
                    ref={ele => this.canvas = ele}
                ></canvas>
                <div className="dashboard">
                    <div className="slider-container">
                        {
                            this.state.parameters.map((item, index) => (
                                <div key={item.title}>
                                    <div className="title">{item.title}</div>
                                    <Slider min={-2} max={2} defaultValue={item.defaultValue} handle={this._getHandle(index)} step={0.1}/>
                                </div>
                            ))
                        }
                    </div>
                    <div className="button-container">
                        <button className="start-btn" onClick={
                            () => {
                                cancelAnimationFrame(this.req);
                                this.points2 = [];
                                this.points1 = [];
                                this.scale = 1;
                                this.center = [this.radius - this.state.ratio, 0];
                                this._drawLine(0, 1, this.parameters);
                            }
                        }>Start</button>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const gl = this.canvas.getContext('webgl');
        this.line = new Line(gl);
        this.multiLine = new MultiLine(gl);

        const x = this.radius / this.state.ratio - 1;
        const y = this.radius;
        this.line.draw([x, y], [x, -y]);
    }

    _drawLine(t: number, omegaBar: number = 1, parameters: number[] = [1, 0, 0, 0, 0, 0]) {
        const omega = Math.PI / 360;
        const theta = t * omega * omegaBar;
        if (theta > Math.PI * 2) {
            return;
        }
        const ratio = this.state.ratio;
        const r = this.radius;
        const sx = this._Fourier(theta, parameters.slice(0, 3)) * omega * r;
        const sy = this._Fourier(theta, parameters.slice(3)) * omega * r;
        this.center = [this.center[0] + sx, this.center[1] + sy];
        const deltaX = r * Math.cos(Math.PI / 2 - theta);
        const deltaY = r * Math.sin(Math.PI / 2 - theta);
        const x1 = (this.center[0] - deltaX) / ratio;
        const y1 = this.center[1] - deltaY;
        const x2 = (this.center[0] + deltaX) / ratio;
        const y2 = this.center[1] + deltaY;

        const criticalValue = 1 / this.scale;

        if (
            x1 > criticalValue || x1 < -criticalValue
            || x2 > criticalValue || x2 < -criticalValue
            || y1 > criticalValue || y1 < -criticalValue
            || y2 > criticalValue || y2 < -criticalValue
        ) {
            this.scale = 0.8 * this.scale;
        }
        const transform = this._getScaleTransform(this.scale);
        this.line.draw([x1, y1], [x2, y2], transform);
        this.points1.push([x1, y1]);
        this.points2.push([x2, y2]);
        this.multiLine.draw(this.points1, [1.0, 0, 0, 1], transform);
        this.multiLine.draw(this.points2, [0, 0, 1.0, 1], transform);
        this.req = window.requestAnimationFrame(() => this._drawLine(t + 1, omegaBar, parameters));
    }

    _getScaleTransform(scale: number) {
        return [
            scale, 0, 0, 0,
            0, scale, 0, 0,
            0, 0, scale, 0,
            0, 0, 0, 1
        ];
    }

    _getHandle(i: number) {
        return (props) => {
            const { value, dragging, index, ...restProps } = props;
            this.parameters = this.parameters.slice();
            this.parameters[i] = value;
            return (
              <Tooltip
                prefixCls="rc-slider-tooltip"
                overlay={value}
                visible={dragging}
                placement="top"
                key={index}
              >
                <Handle value={value} {...restProps} />
              </Tooltip>
            );
          };
    }

    _Fourier(theta: number, parameters: number[]) {
        return parameters.slice(1).reduce((pValue, cValue, index) => {
            const n = Math.ceil((index + 1) / 2);
            if (index % 2 === 0) {
                return pValue + Math.cos(n * theta) * cValue;
            }

            return pValue + Math.sin(n * theta) * cValue;
        }, parameters[0]);
    }
}

ReactDom.render(<App />, document.getElementById('root'));
