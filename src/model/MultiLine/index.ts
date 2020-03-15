/**
 * @file 直线模型
 * @author zhangluyao01
 */
import Base from '../base';
import fragmentShaderStr from './line.frag';
import vertexShaderStr from './line.vert';

const A_VERTEX = 'a_Vertex_1';
const U_COLOR = 'u_Color_1';
const U_TRANSFORM = 'u_Transform_1';


export class MultiLine extends Base {
    aVertexLocation: number;
    uColorLocation: WebGLUniformLocation;
    uTransformLocation: WebGLUniformLocation;

    constructor(gl: WebGLRenderingContext) {
        super();
        this.gl = gl;
        const vertexShader = this._createShader(vertexShaderStr, this.gl.VERTEX_SHADER);
        const fragmentShader = this._createShader(fragmentShaderStr, this.gl.FRAGMENT_SHADER);

        this.program = this._initProgram(vertexShader, fragmentShader);
    }

    _initVertexData(points: [number, number][]): Float32Array {
        const n = points.length;
        let data = new Float32Array(3 * n);

        points.forEach((point, index) => {
            data[0 + 3 * index] = point[0];
            data[1 + 3 * index] = point[1];
            data[2 + 3 * index] = 0;
        })


        return data;
    }

    _initTransformData(transform: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]): Float32Array {
        return Float32Array.from(transform);
    }

    _initColorData(color: number[] = [0, 0, 0, 1]): Float32Array {
        return Float32Array.from(color);
    }

    draw(points: [number, number][], color?: number[], transform?: number[]) {
        this._activeProgram(this.program);
        this.aVertexLocation = this.gl.getAttribLocation(this.program, A_VERTEX);
        this.uColorLocation = this.gl.getUniformLocation(this.program, U_COLOR);
        this.uTransformLocation = this.gl.getUniformLocation(this.program, U_TRANSFORM);

        const transformData = this._initTransformData(transform);
        const vertexData = this._initVertexData(points);
        const colorData = this._initColorData(color);

        this.gl.uniformMatrix4fv(this.uTransformLocation, false, transformData);
        this.gl.uniform4fv(this.uColorLocation, colorData);

        const bufferId = this._createBufferObject(vertexData);
        this.gl.vertexAttribPointer(this.aVertexLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.aVertexLocation);

        this.gl.drawArrays(this.gl.LINE_LOOP, 0, points.length);
    }
}