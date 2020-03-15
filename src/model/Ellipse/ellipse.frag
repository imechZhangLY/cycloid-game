precision mediump int;
precision mediump float;

uniform vec4 u_Color;
varying vec2 v_Texture;

bool is_in_circle(vec2 tex_coords) {
    float x = tex_coords.x;
    float y = tex_coords.y;

    if (x * x + y * y < 1.0) {
        return true;
    }

    return false;
}
void main() {
    if (is_in_circle(v_Texture)) {
        gl_FragColor = u_Color;
    }
}