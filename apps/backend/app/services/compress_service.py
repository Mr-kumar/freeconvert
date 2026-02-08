"""
Image compression service for reducing file sizes.
Logic: Use Pillow to compress images with different quality levels and optimize file sizes.
"""

import logging
import io
from typing import Tuple, Optional

from PIL import Image, ImageOps
import pillow_heif

logger = logging.getLogger(__name__)


class CompressService:
    """Service for compressing images and PDFs."""
    
    def __init__(self):
        """Initialize compress service."""
        self.supported_formats = {
            'JPEG', 'JPG', 'jpg', 'jpeg',
            'PNG', 'png',
            'WEBP', 'webp',
            'HEIC', 'heif'
        }
    
    def compress_image(self, image_data: bytes, compression_level: str = "medium") -> bytes:
        """
        Compress an image with specified compression level.
        
        Args:
            image_data: Image data as bytes
            compression_level: Compression level (low, medium, high)
            
        Returns:
            bytes: Compressed image data
        """
        try:
            # Open image
            img = Image.open(io.BytesIO(image_data))
            original_format = img.format
            
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            # Get compression settings
            quality, optimize = self._get_compression_settings(compression_level)
            
            # Handle HEIC/HEIF images
            if original_format and original_format.upper() in ['HEIC', 'HEIF']:
                img = self._convert_heif_to_jpeg(img)
                original_format = 'JPEG'
            
            # Compress image
            output_stream = io.BytesIO()
            
            if original_format == 'PNG':
                # For PNG, use optimize parameter
                img.save(output_stream, format='PNG', optimize=optimize, compress_level=1)
            else:
                # For JPEG/WEBP, use quality parameter
                img.save(output_stream, format=original_format, quality=quality, optimize=True)
            
            compressed_data = output_stream.getvalue()
            
            # Log compression results
            original_size = len(image_data)
            compressed_size = len(compressed_data)
            compression_ratio = (original_size - compressed_size) / original_size * 100
            
            logger.info(f"Image compressed: {original_size} -> {compressed_size} bytes "
                       f"({compression_ratio:.1f}% reduction)")
            
            return compressed_data
            
        except Exception as e:
            logger.error(f"Image compression failed: {e}")
            raise ValueError(f"Failed to compress image: {str(e)}")
    
    def compress_pdf(self, pdf_data: bytes, compression_level: str = "medium") -> bytes:
        """
        Compress a PDF by reducing quality and removing unnecessary data.
        
        Args:
            pdf_data: PDF data as bytes
            compression_level: Compression level (low, medium, high)
            
        Returns:
            bytes: Compressed PDF data
        """
        try:
            # For PDF compression, we'll use PyPDF2 to remove metadata and optimize
            import PyPDF2
            from PyPDF2 import PdfReader, PdfWriter
            
            pdf_stream = io.BytesIO(pdf_data)
            pdf_reader = PdfReader(pdf_stream)
            
            if not pdf_reader.pages:
                return pdf_data  # Return original if no pages
            
            # Create new PDF writer
            pdf_writer = PdfWriter()
            
            # Copy pages with optimization based on compression level
            for page in pdf_reader.pages:
                if compression_level == "high":
                    # High compression: reduce image quality
                    if hasattr(page, '/Images'):
                        for img in page.images:
                            if hasattr(img, 'image'):
                                # Reduce image quality
                                img.image.replace(img.image, _self_compression_hook(img.image))
                
                elif compression_level == "low":
                    # Low compression: preserve quality
                    pdf_writer.add_page(page)
                else:
                    # Medium compression: balanced approach
                    if hasattr(page, '/Images'):
                        for img in page.images:
                            if hasattr(img, 'image'):
                                # Moderate image compression
                                img.image.replace(img.image, _self_compression_hook(img.image, 0.8))
                    
                    pdf_writer.add_page(page)
            
            # Write compressed PDF
            output_stream = io.BytesIO()
            pdf_writer.write(output_stream)
            compressed_data = output_stream.getvalue()
            
            # Log compression results
            original_size = len(pdf_data)
            compressed_size = len(compressed_data)
            compression_ratio = (original_size - compressed_size) / original_size * 100
            
            logger.info(f"PDF compressed: {original_size} -> {compressed_size} bytes "
                       f"({compression_ratio:.1f}% reduction)")
            
            return compressed_data
            
        except ImportError:
            logger.error("PyPDF2 not available for PDF compression")
            return pdf_data  # Return original if PyPDF2 not available
        except Exception as e:
            logger.error(f"PDF compression failed: {e}")
            raise ValueError(f"Failed to compress PDF: {str(e)}")
    
    def _get_compression_settings(self, level: str) -> Tuple[int, bool]:
        """
        Get compression quality and optimize settings based on level.
        
        Args:
            level: Compression level (low, medium, high)
            
        Returns:
            Tuple[int, bool]: (quality, optimize)
        """
        settings = {
            "low": (95, True),      # High quality, light optimization
            "medium": (85, True),   # Balanced quality and optimization
            "high": (70, True),     # Lower quality, strong optimization
        }
        return settings.get(level, (85, True))
    
    def _convert_heif_to_jpeg(self, img: Image) -> Image:
        """
        Convert HEIF/HEIF image to JPEG format.
        
        Args:
            img: PIL Image object
            
        Returns:
            Image: Converted JPEG image
        """
        try:
            # Use pillow_heif if available, otherwise fall back to basic conversion
            if img.format in ('HEIC', 'HEIF'):
                try:
                    # Convert HEIF to JPEG using pillow_heif
                    heif_file = pillow_heif.from_heif(img)
                    jpeg_data = heif_file.to_jpeg(format='JPEG', quality=95)
                    return Image.open(io.BytesIO(jpeg_data))
                except:
                    # Fallback: save as JPEG then reload
                    temp_stream = io.BytesIO()
                    img.save(temp_stream, format='JPEG', quality=95)
                    temp_stream.seek(0)
                    return Image.open(temp_stream)
            else:
                # Convert directly to JPEG
                rgb_img = img.convert('RGB')
                return rgb_img
                
        except Exception as e:
            logger.error(f"HEIF conversion failed: {e}")
            return img.convert('RGB')
    
    def _self_compression_hook(self, image_data, factor: float = 0.7) -> bytes:
        """
        Custom compression hook for reducing image data size.
        
        Args:
            image_data: Original image data
            factor: Compression factor (0.0-1.0)
            
        Returns:
            bytes: Compressed image data
        """
        try:
            img = Image.open(io.BytesIO(image_data))
            
            # Resize if needed (optional optimization)
            width, height = img.size
            if max(width, height) > 2000:
                # Resize large images
                new_width = int(width * factor)
                new_height = int(height * factor)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Apply compression
            output_stream = io.BytesIO()
            img.save(output_stream, format='JPEG', quality=85, optimize=True)
            return output_stream.getvalue()
            
        except Exception:
            return image_data  # Return original if compression fails
    
    def get_image_info(self, image_data: bytes) -> dict:
        """
        Get information about an image file.
        
        Args:
            image_data: Image file data as bytes
            
        Returns:
            dict: Image information
        """
        try:
            img = Image.open(io.BytesIO(image_data))
            
            return {
                "format": img.format,
                "mode": img.mode,
                "size": img.size,
                "width": img.width,
                "height": img.height,
                "has_transparency": img.mode in ('RGBA', 'LA', 'P'),
                "file_size": len(image_data)
            }
            
        except Exception as e:
            logger.error(f"Failed to get image info: {e}")
            return {
                "format": "unknown",
                "error": str(e)
            }
    
    def validate_image(self, image_data: bytes) -> bool:
        """
        Validate if the data represents a valid image.
        
        Args:
            image_data: File data to validate
            
        Returns:
            bool: True if valid image
        """
        try:
            img = Image.open(io.BytesIO(image_data))
            return img.format in self.supported_formats
            
        except Exception as e:
            logger.error(f"Image validation failed: {e}")
            return False
