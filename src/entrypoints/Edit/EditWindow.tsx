import { listen } from '@tauri-apps/api/event';
import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Transformer, Rect } from 'react-konva';
import useShortcuts from '@/hooks/use-shortcuts';
import { useAtom } from 'jotai';
import atoms from '@/atoms';
import PencilComponent from '@/components/core/Edit/PencilComponent';
import BlurComponent from '@/components/core/Edit/BlurComponent';
import { emitKeys } from '@/utils/config';
import TypeComponent from '@/components/core/Edit/TextComponent';
import NumbersComponent from '@/components/core/Edit/NumbersComponent';
import LinkComponent from '@/components/core/Edit/LinkComponent';
import UndoComponent from '@/components/core/Edit/UndoComponent';
import RedoComponent from '@/components/core/Edit/RedoComponent';
import SettingsComponent from '@/components/core/Edit/SettingsComponent';
import InfoComponent from '@/components/core/Edit/InfoComponent';
import CircleComponent from '@/components/core/Edit/CircleComponent';
import SquareComponent from '@/components/core/Edit/SquareComponent';

const EditWindow = () => {
  const [sel, setSel] = useState({ visible: false, x1: 0, y1: 0, x2: 0, y2: 0 });
  const [bgImage, setBgImage] = useAtom(atoms.bgImageAtom);
  const getStageSize = () => ({
    width: Math.max(320, Math.min(Math.floor(window.innerWidth * 0.84), window.innerWidth - 32)),
    height: Math.max(240, Math.min(Math.floor(window.innerHeight * 0.76), window.innerHeight - 112)),
  });
  const [stageSize, setStageSize] = useState(getStageSize);
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

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // const bgImage = localStorage.getItem("bgImage") || ""
      escapeShortcut(e, "edit")
      if (e.key === "Enter" && Object.keys(holePunchRef) && holePunchRef.current.attrs.height && holePunchRef.current.attrs.width) {
        // const { x, y, width, height } = holePunchRef.current.attrs
        // const cropped_base_64_image = (await cropBase64ImageHandler(bgImage, x, y, width, height)) as string
        // await invoke("region_screenshot_command", { cropped_base_64_image });
        // invoke("close_overlay_window_command")
      } else {
        // invoke("open_Edit_window_command")
        // self.postMessage({ data: bgImage }, "*")
        // const response = await invoke("full_screenshot_command", { base_64_image: bgImage });
        // console.log(response, 'response')
        // invoke("close_overlay_window_command")
      }
    };

    const handleFocus = () => {
      setSel({ visible: false, x1: 0, y1: 0, x2: 0, y2: 0 });
      trRef.current?.nodes([]);
      isDrawing.current = false;
    };

    const handleResize = () => {
      setStageSize(getStageSize());
    };

    const unlisten = listen(emitKeys.send_base64_img_edit_window, (event: any) => {
      console.log(event.payload.bgImage.slice(0, 224), 'in edit window')
      const base64Image = event.payload.bgImage
      localStorage.setItem("bgImage", base64Image)
      setBgImage(base64Image)
    })

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("focus", handleFocus);
    window.addEventListener("resize", handleResize);

    const bgImage = localStorage.getItem("bgImage") || ""
    setBgImage(bgImage)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("resize", handleResize);
      unlisten.then(f => f())
    }
  }, [])

  return (
    <div className='main'>
      <div className='nav'>
        <CircleComponent />
        <SquareComponent />
        <TypeComponent />
        <NumbersComponent />
        <PencilComponent />
        <LinkComponent />
        <BlurComponent />
        <UndoComponent />
        <RedoComponent />
        <LinkComponent />
        <SettingsComponent />
        <InfoComponent />
      </div>
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleStageClick}
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        }}
        className='edit-window'
      >
        <Layer>
          <Rect
            x={0} y={0}
            width={stageSize.width}
            height={stageSize.height}
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

    </div>
  );
};

export default EditWindow;
