import { useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Slider,
} from '@heroui/react'
import { ImageIcon, ScissorsIcon, XCircleIcon } from 'lucide-react'
import ToastNotification from '../toast-notification/ToastNotification'
import type { Area, Point } from 'react-easy-crop'
import { getCroppedImg, readFile } from '~/helpers/image-canvas'

export default function ImageCropperModal({
  isOpen,
  onOpenChange,
  setCroppedImage,
}: {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  setCroppedImage: (url: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [imageSrc, setImageSrc] = useState('')
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState<number>(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number
    y: number
    width: number
    height: number
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const onCroppedImageHandler = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, 0)
      //   console.log('donee', { croppedImage })
      setCroppedImage(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }

  const onFileChangeHandler = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0]

    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/webp', 'image/jpeg', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        ToastNotification({
          color: 'Danger',
          title: 'Invalid File Type',
          description: 'Please select an image file of type png, jpg, or jpeg.',
        })
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 5 * 1024 * 1024) {
        ToastNotification({
          color: 'Danger',
          title: 'Invalid File Type',
          description: 'Please select an image smaller than 5MB.',
        })
        return
      }

      const imageDataUrl = await readFile(file)

      setImageSrc(imageDataUrl)
    }
  }

  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Modal Title
            </ModalHeader>
            <ModalBody>
              <div className="relative w-full h-[500px] mb-6 border border-dashed border-secondary rounded-lg ">
                {imageSrc ? (
                  <div className="relative w-full h-full">
                    <Cropper
                      image={imageSrc}
                      showGrid={false}
                      crop={crop}
                      zoom={zoom}
                      aspect={4 / 5}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </div>
                ) : (
                  <>
                    <div className="w-full h-full flex items-center justify-center gap-2">
                      <ImageIcon size={36} className="text-secondary" />
                      <Button
                        color="secondary"
                        onPress={() => inputRef.current?.click()}
                      >
                        Upload Image
                      </Button>
                    </div>
                    <input
                      type="file"
                      onChange={onFileChangeHandler}
                      ref={inputRef}
                      className="sr-only"
                    />
                  </>
                )}

                <div className="mt-3">
                  <Slider
                    value={zoom}
                    minValue={1}
                    maxValue={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(value) => setZoom(Number(value))}
                    isDisabled={!imageSrc}
                    color="secondary"
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  onClose(), setImageSrc('')
                }}
              >
                <XCircleIcon size={16} className="-mr-1" />
                Close
              </Button>
              <Button
                color="primary"
                onPress={onCroppedImageHandler}
                className="text-base  "
              >
                <ScissorsIcon size={16} className="-mr-1" />
                Crop Image
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
