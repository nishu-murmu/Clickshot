import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Transformer, Rect } from 'react-konva';
import useShortcuts from './hooks/use-shortcuts';
import { useAtom } from 'jotai';
import atoms from './atoms';

const App = () => {
  const [sel, setSel] = useState({ visible: false, x1: 0, y1: 0, x2: 0, y2: 0 });
  const [bgImage, setBgImage] = useAtom(atoms.bgImageAtom);
  const isDrawing = useRef(false);
  const trRef = useRef<any>(null);
  const rectRef = useRef<any>(null);
  const holePunchRef = useRef<any>(null);
  const { escapeShortcut } = useShortcuts()

  const x = Math.min(sel.x1, sel.x2);
  const y = Math.min(sel.y1, sel.y2);
  const w = Math.abs(sel.x2 - sel.x1);
  const h = Math.abs(sel.y2 - sel.y1);

  // keeps hole punch in sync when dragging or resizing
  const syncHolePunch = () => {
    if (!rectRef.current || !holePunchRef.current) return;
    const n = rectRef.current;
    holePunchRef.current.setAttrs({
      x: n.x(),
      y: n.y(),
      width: n.width() * n.scaleX(),
      height: n.height() * n.scaleY(),
    });
    holePunchRef.current.getLayer().batchDraw();
  };

  const handleMouseDown = (e: any) => {
    if (e.target !== e.target.getStage()) return; // ignore clicks on rect/transformer
    trRef.current?.nodes([]);
    const p = e.target.getStage().getPointerPosition();
    isDrawing.current = true;
    setSel({ visible: true, x1: p.x, y1: p.y, x2: p.x, y2: p.y });
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    const p = e.target.getStage().getPointerPosition();
    setSel(prev => ({ ...prev, x2: p.x, y2: p.y }));
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    trRef.current?.nodes([rectRef.current]); // attach transformer after drawing
  };

  const handleStageClick = (e: any) => {
    if (isDrawing.current) return;
    if (e.target === e.target.getStage()) {
      setSel(prev => ({ ...prev, visible: false }));
      trRef.current?.nodes([]);
    }
  };

  const cropBase64ImageHandler = (base64Str: string, x: number, y: number, width: number, height: number): Promise<string | Error> => {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.src = base64Str
      image.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(image, x, y, width, height, 0, 0, width, height)
        const croppedBase64 = canvas.toDataURL("image/jpeg")
        resolve(croppedBase64)
      }
      image.onerror = () => {
        reject(new Error("Failed to load image while cropping the image!"))
      }
    })
  }

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      escapeShortcut(e)
      if (e.key === "Enter" && Object.keys(holePunchRef.current.attrs)) {
        const { x, y, width, height } = holePunchRef.current.attrs;
        const bgImage = localStorage.getItem("bgImage") || ""
        const cropped_base_64_image = (await cropBase64ImageHandler(bgImage, x, y, width, height)) as string
        console.log(cropped_base_64_image)
        const response = await invoke("region_screenshot_command", {cropped_base_64_image});
        invoke("close_overlay_command")
        console.log(response, 'response from region screenshot')
      }
    };

    const handleFocus = () => {
      setSel({ visible: false, x1: 0, y1: 0, x2: 0, y2: 0 });
      trRef.current?.nodes([]);
      isDrawing.current = false;
    };

    listen("screenshot-ready", (event: any) => {
      const base64Image = `data:image/png;base64,${event.payload}`
      localStorage.setItem("bgImage", base64Image)
      setBgImage(base64Image)
    })

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("focus", handleFocus);
    }
  }, [])

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleStageClick}
      style={{
        background: `url(${bgImage})`
      }}
    >
      <Layer>
        <Rect
          x={0} y={0}
          width={window.innerWidth}
          height={window.innerHeight}
          fill="rgba(0,0,0,0.5)"
          listening={false}
        />
        <Rect
          ref={holePunchRef}
          x={x} y={y} width={w} height={h}
          fill="black"
          globalCompositeOperation="destination-out"
          visible={sel.visible}
          listening={false}
        />
      </Layer>

      {/* Layer 2 — draggable selection border + transformer */}
      <Layer>
        <Rect
          ref={rectRef}
          x={x} y={y} width={w} height={h}
          fill="transparent"
          stroke="#87CEEB"
          strokeWidth={2}
          draggable
          visible={sel.visible}
          onDragMove={syncHolePunch}
          onTransform={syncHolePunch}
          onTransformEnd={() => {
            // normalize scale back to 1 after resize
            const node = rectRef.current;
            node.setAttrs({
              width: node.width() * node.scaleX(),
              height: node.height() * node.scaleY(),
              scaleX: 1,
              scaleY: 1,
            });
            syncHolePunch();
          }}
        />
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          anchorCornerRadius={50}
          anchorFill="white"
          anchorStroke="#1D9E75"
          borderStroke="#1D9E75"
          keepRatio={false}
        />
      </Layer>
    </Stage>
  );
};

export default App;
