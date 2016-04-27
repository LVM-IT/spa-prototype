export class BoundingRect {
    constructor(public left?: number,
                public right?: number,
                public top?: number,
                public bottom?: number,
                public height?: number,
                public width?: number) {
    }

    public static fromClientRect(clientRect: ClientRect): BoundingRect {
        return new BoundingRect(clientRect.left, clientRect.right, clientRect.top, clientRect.bottom, clientRect.height, clientRect.width);
    }
}
