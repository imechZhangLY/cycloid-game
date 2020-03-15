/**
 * @file webgl几何模型的基类
 * @author zhangluyao01
 */
export default class Base {
    gl: WebGLRenderingContext;
    program: WebGLProgram;

    render() {

    }

    _createBufferObject(data: Float32Array): WebGLBuffer {
        const bufferId = this.gl.createBuffer();

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferId);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);

        return bufferId;
    }

    _createShader(sourceCode: string, type: number): WebGLShader {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, sourceCode);

        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw 'Webgl Program Compile Error! ' + this.gl.getShaderInfoLog(shader);
        }

        return shader;
    }

    _initProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);

        return program;
    }

    _activeProgram(program: WebGLProgram) {
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            throw 'Webgl Linking Program Error! ' + this.gl.getProgramInfoLog(program);
        }

        this.gl.useProgram(program);
    }

    _loadTexture(src: string): WebGLTexture {
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        const level = 0;
        const internalFormat = this.gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = this.gl.RGBA;
        const srcType = this.gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);

        this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

        const image = new Image();

        image.onload = () => {
            // 为什么要重新bind一遍
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

            this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

            // 宽高是否是2的整数次幂的图片webgl的处理逻辑不一样
            if (this._isPowerOf2(image.width) && this._isPowerOf2(image.height)) {
                console.log(12233);
                this.gl.generateMipmap(this.gl.TEXTURE_2D);
            } else {
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            }
        };

        image.src = src;

        return texture;
    }

    /**
     * 是否是2的整数次幂
     *
     * @param {number} value 图片的宽或者高
     * @return {boolean}
     */
    _isPowerOf2(value: number): boolean {
        return (value & (value - 1)) === 0;
    }

    clearScreen() {
        this.gl.clearColor(.25, .5, .75, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
}