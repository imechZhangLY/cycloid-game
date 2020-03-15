/**
 * @file 直线模型
 * @author zhangluyao01
 */
import Base from '../base';
import fragmentShaderStr from './ellipse.frag';
import vertexShaderStr from './ellipse.vert';

export class Ellipse extends Base {
    aVertexLocation: number;
    aTextureLocation: number;
    uColorLocation: WebGLUniformLocation;
    uTransformLocation: WebGLUniformLocation;

    constructor(gl: WebGLRenderingContext) {
        super();
        this.gl = gl;
        const vertexShader = this._createShader(vertexShaderStr, this.gl.VERTEX_SHADER);
        const fragmentShader = this._createShader(fragmentShaderStr, this.gl.FRAGMENT_SHADER);

        this.program = this._initProgram(vertexShader, fragmentShader);
        this.aVertexLocation = this.gl.getAttribLocation(this.program, 'a_Vertex');
        this.aTextureLocation = this.gl.getAttribLocation(this.program, 'a_Texture');
        this.uColorLocation = this.gl.getUniformLocation(this.program, 'u_Color');
        this.uTransformLocation = this.gl.getUniformLocation(this.program, 'u_Transform');
    }

    _initVertexData(center: number[], a: number, b: number): Float32Array {
        let data = [];

        // 保证点是Triangle strip的规则 1，2，3满足顺时针，3，2，4满足顺时针。
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                data.push(center[0] + (-1) ** i * a);
                data.push(center[1] + (-1) ** j * b);
                data.push(0);
            }
        }

        return Float32Array.from(data);
    }

    _initTextureData(): Float32Array {
        let data = [];

        // 归一化后的坐标系
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                data.push((-1) ** i);
                data.push((-1) ** j);
            }
        }

        return Float32Array.from(data);
    }


    _initTransformData(transform: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]): Float32Array {
        return Float32Array.from(transform);
    }

    _initColorData(color: number[] = [0, 0, 0, 1]): Float32Array {
        return Float32Array.from(color);
    }

    draw(center: number[], a: number, b: number, transform?: number[], color?: number[]) {
        // 删除上一步画的结果
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        const transformData = this._initTransformData(transform);
        const vertexData = this._initVertexData(center, a, b);
        const textureData = this._initTextureData();
        const colorData = this._initColorData(color);
        console.log(vertexData);
        console.log(textureData);

        this.gl.uniformMatrix4fv(this.uTransformLocation, false, transformData);
        this.gl.uniform4fv(this.uColorLocation, colorData);

        const vertexBufferId = this._createBufferObject(vertexData);
        this.gl.vertexAttribPointer(this.aVertexLocation, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.aVertexLocation);

        const textureBufferId = this._createBufferObject(textureData);
        this.gl.vertexAttribPointer(this.aTextureLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.aTextureLocation);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}