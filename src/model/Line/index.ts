/**
 * @file 直线模型
 * @author zhangluyao01
 */
import Base from '../base';
import fragmentShaderStr from './line.frag';
import vertexShaderStr from './line.vert';

export class Line extends Base {
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

    _initVertexData(startPoint: number[], endPoint: number[]): Float32Array {
        let data = new Float32Array(6);

        data[0] = startPoint[0];
        data[1] = startPoint[1];
        data[2] = 0;

        data[3] = endPoint[0];
        data[4] = endPoint[1];
        data[5] = 0;

        return data;
    }

    _initTransformData(transform: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]): Float32Array {
        return Float32Array.from(transform);
    }

    _initColorData(color: number[] = [0, 0, 0, 1]): Float32Array {
        return Float32Array.from(color);
    }

    draw(startPoint: number[], endPoint: number[], transform?: number[], color?: number[]) {
        // 删除上一步画的结果
        // this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this._activeProgram(this.program);

        this.aVertexLocation = this.gl.getAttribLocation(this.program, 'a_Vertex');
        this.uColorLocation = this.gl.getUniformLocation(this.program, 'u_Color');
        this.uTransformLocation = this.gl.getUniformLocation(this.program, 'u_Transform');

        const transformData = this._initTransformData(transform);
        const vertexData = this._initVertexData(startPoint, endPoint);
        const colorData = this._initColorData(color);

        this.gl.uniformMatrix4fv(this.uTransformLocation, false, transformData);
        this.gl.uniform4fv(this.uColorLocation, colorData);

        const bufferId = this._createBufferObject(vertexData);
        this.gl.vertexAttribPointer(this.aVertexLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.aVertexLocation);

        this.gl.drawArrays(this.gl.LINE_LOOP, 0, 2);
    }
}