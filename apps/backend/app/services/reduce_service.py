"""
PDF size reduction service for optimizing file sizes.
Logic: Use PyPDF2 and image optimization to reduce PDF file sizes at different levels.
"""

import logging
import io
import subprocess
from typing import Dict, Any, Optional
from PIL import Image

try:
    from PyPDF2 import PdfReader, PdfWriter
except ImportError:
    try:
        import pypdf
        from pypdf import PdfReader, PdfWriter
    except ImportError:
        raise ImportError("Neither PyPDF2 nor pypdf is available. Install one of them.")

logger = logging.getLogger(__name__)


class ReduceService:
    """Service for reducing PDF file sizes."""
    
    def __init__(self):
        """Initialize reduce service."""
        self.reader = None
        self.writer = None
        
        # Try to initialize with PyPDF2 first
        try:
            self.reader = PdfReader
            self.writer = PdfWriter
            logger.info("Initialized reduce service with PyPDF2")
        except:
            # Fallback to pypdf
            self.reader = PdfReader
            self.writer = PdfWriter
            logger.info("Initialized reduce service with pypdf")
    
    def reduce_pdf(self, pdf_data: bytes, compression_level: str = "medium") -> bytes:
        """
        Reduce PDF file size using different compression strategies.
        
        Args:
            pdf_data: PDF file data as bytes
            compression_level: Compression level (low, medium, high)
            
        Returns:
            bytes: Reduced PDF data
        """
        try:
            pdf_stream = io.BytesIO(pdf_data)
            if self.reader.__name__ == 'PdfReader':
                pdf_reader = self.reader(pdf_stream)
            else:
                pdf_reader = self.reader(pdf_stream)
            
            if not pdf_reader.pages:
                return pdf_data  # Return original if no pages
            
            # Create new PDF writer
            pdf_writer = PdfWriter()
            
            # Apply reduction strategy based on level
            if compression_level == "low":
                reduced_data = self._reduce_low(pdf_reader, pdf_writer)
            elif compression_level == "high":
                reduced_data = self._reduce_high(pdf_reader, pdf_writer)
            else:
                # Medium compression (default)
                reduced_data = self._reduce_medium(pdf_reader, pdf_writer)
            
            # Write reduced PDF
            output_stream = io.BytesIO()
            pdf_writer.write(output_stream)
            result = output_stream.getvalue()
            
            # Log reduction results
            original_size = len(pdf_data)
            reduced_size = len(result)
            reduction_ratio = (original_size - reduced_size) / original_size * 100
            
            logger.info(f"PDF reduced: {original_size} -> {reduced_size} bytes "
                       f"({reduction_ratio:.1f}% reduction) with {compression_level} compression")
            
            return result
            
        except Exception as e:
            logger.error(f"PDF reduction failed: {e}")
            raise ValueError(f"Failed to reduce PDF: {str(e)}")
    
    def _reduce_low(self, pdf_reader, pdf_writer) -> bytes:
        """
        Low reduction: Preserve quality, minimal compression.
        """
        for page in pdf_reader.pages:
            # Remove unnecessary metadata
            if hasattr(page, '/Resources'):
                page.Resources = {}
            
            # Remove annotations and form fields
            if hasattr(page, '/Annots'):
                del page.Annots
            if hasattr(page, '/Fields'):
                del page.Fields
            
            pdf_writer.add_page(page)
        
        output_stream = io.BytesIO()
        pdf_writer.write(output_stream)
        return output_stream.getvalue()
    
    def _reduce_medium(self, pdf_reader, pdf_writer) -> bytes:
        """
        Medium reduction: Balance between quality and size.
        """
        for page in pdf_reader.pages:
            # Remove unnecessary resources
            if hasattr(page, '/Resources'):
                page.Resources = {}
            
            # Compress images within PDF
            if hasattr(page, '/Images'):
                for img in page.images:
                    if hasattr(img, 'image'):
                        # Compress images to 85% quality
                        img.image.replace(img.image, self._compress_image_data(img.image))
            
            # Remove annotations
            if hasattr(page, '/Annots'):
                del page.Annots
            
            pdf_writer.add_page(page)
        
        output_stream = io.BytesIO()
        pdf_writer.write(output_stream)
        return output_stream.getvalue()
    
    def _reduce_high(self, pdf_reader, pdf_writer) -> bytes:
        """
        High reduction: Maximum compression, aggressive optimization.
        """
        for page in pdf_reader.pages:
            # Remove all non-essential resources
            if hasattr(page, '/Resources'):
                page.Resources = {}
            if hasattr(page, '/Images'):
                page.Images = []
            
            # Remove annotations, forms, and metadata
            for attr in ['/Annots', '/Fields', '/MediaBox', '/CropBox', '/BleedBox']:
                if hasattr(page, attr):
                    delattr(page, attr)
            
            # Downsample images significantly
            if hasattr(page, '/Images'):
                for img in page.Images:
                    if hasattr(img, 'image'):
                        # Compress images to 50% quality
                        img.image.replace(img.image, self._compress_image_data(img.image, 0.5))
            
            pdf_writer.add_page(page)
        
        output_stream = io.BytesIO()
        pdf_writer.write(output_stream)
        return output_stream.getvalue()
    
    def _compress_image_data(self, image_data: bytes, quality_factor: float = 0.7) -> bytes:
        """
        Compress image data within PDF.
        
        Args:
            image_data: Original image data
            quality_factor: Compression factor (0.0-1.0)
            
        Returns:
            bytes: Compressed image data
        """
        try:
            img = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            # Resize if large (optional optimization)
            width, height = img.size
            if max(width, height) > 1000:
                new_width = int(width * quality_factor)
                new_height = int(height * quality_factor)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Compress image
            output_stream = io.BytesIO()
            img.save(output_stream, format='JPEG', quality=int(85 * quality_factor), optimize=True)
            return output_stream.getvalue()
            
        except Exception:
            return image_data  # Return original if compression fails
    
    def reduce_with_ghostscript(self, pdf_data: bytes, compression_level: str = "medium") -> Optional[bytes]:
        """
        Alternative reduction using Ghostscript for better compression.
        
        Args:
            pdf_data: PDF file data as bytes
            compression_level: Compression level
            
        Returns:
            Optional[bytes]: Reduced PDF data or None if Ghostscript unavailable
        """
        try:
            # Save PDF to temporary file
            import tempfile
            import os
            
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
                temp_file.write(pdf_data)
                temp_file_path = temp_file.name
            
            # Ghostscript command for PDF optimization
            gs_commands = {
                "low": [
                    "gs", "-sDEVICE=pdfwrite",
                    "-dCompatibilityLevel=1.4",
                    "-dDownScaleColorImages=true",
                    "-dAutoRotatePages=/None",
                    "-dColorImageDownscaleType=/Bicubic",
                    "-dColorImageDownscaleThreshold=1.0",
                    "-dColorImageResolution=150",
                    "-f", temp_file_path, "-o", temp_file_path + "_reduced.pdf"
                ],
                "medium": [
                    "gs", "-sDEVICE=pdfwrite",
                    "-dCompatibilityLevel=1.4",
                    "-dDownScaleColorImages=true",
                    "-dAutoRotatePages=/None",
                    "-dColorImageDownscaleType=/Bicubic",
                    "-dColorImageDownscaleThreshold=0.5",
                    "-dColorImageResolution=120",
                    "-f", temp_file_path, "-o", temp_file_path + "_reduced.pdf"
                ],
                "high": [
                    "gs", "-sDEVICE=pdfwrite",
                    "-dCompatibilityLevel=1.4",
                    "-dDownScaleColorImages=true",
                    "-dAutoRotatePages=/None",
                    "-dColorImageDownscaleType=/Bicubic",
                    "-dColorImageDownscaleThreshold=0.3",
                    "-dColorImageResolution=96",
                    "-f", temp_file_path, "-o", temp_file_path + "_reduced.pdf"
                ]
            }
            
            cmd = gs_commands.get(compression_level, gs_commands["medium"])
            
            # Run Ghostscript
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                # Read reduced file
                reduced_path = temp_file_path + "_reduced.pdf"
                with open(reduced_path, 'rb') as f:
                    reduced_data = f.read()
                
                # Cleanup temporary files
                os.unlink(temp_file_path)
                os.unlink(reduced_path)
                
                return reduced_data
            else:
                logger.error(f"Ghostscript failed: {result.stderr}")
                return None
                
        except FileNotFoundError:
            logger.warning("Ghostscript not available, falling back to PyPDF2 reduction")
            return None
        except Exception as e:
            logger.error(f"Ghostscript reduction failed: {e}")
            return None
    
    def get_pdf_info(self, pdf_data: bytes) -> Dict[str, Any]:
        """
        Get detailed information about a PDF file.
        
        Args:
            pdf_data: PDF file data as bytes
            
        Returns:
            Dict containing PDF information
        """
        try:
            pdf_stream = io.BytesIO(pdf_data)
            if self.reader.__name__ == 'PdfReader':
                pdf_file = self.reader(pdf_stream)
            else:
                pdf_file = self.reader(pdf_stream)
            
            # Calculate total size
            total_size = 0
            for page in pdf_file.pages:
                # Estimate page size (rough calculation)
                if hasattr(page, '/MediaBox'):
                    box = page.MediaBox
                    width = box[2] - box[0]
                    height = box[3] - box[1]
                    total_size += width * height * 0.001  # Rough estimate in MB
            
            return {
                "pages": len(pdf_file.pages),
                "is_encrypted": pdf_file.is_encrypted,
                "has_images": any(hasattr(page, '/Images') for page in pdf_file.pages),
                "estimated_size_mb": round(total_size, 2),
                "file_size_bytes": len(pdf_data),
                "metadata": dict(pdf_file.metadata) if pdf_file.metadata else {},
                "has_forms": any(hasattr(page, '/Fields') for page in pdf_file.pages),
                "has_annotations": any(hasattr(page, '/Annots') for page in pdf_file.pages)
            }
            
        except Exception as e:
            logger.error(f"Failed to get PDF info: {e}")
            return {
                "pages": 0,
                "error": str(e)
            }
    
    def validate_pdf(self, pdf_data: bytes) -> bool:
        """
        Validate if the data represents a valid PDF.
        
        Args:
            pdf_data: File data to validate
            
        Returns:
            bool: True if valid PDF
        """
        try:
            pdf_stream = io.BytesIO(pdf_data)
            if self.reader.__name__ == 'PdfReader':
                pdf_file = self.reader(pdf_stream)
            else:
                pdf_file = self.reader(pdf_stream)
            
            return len(pdf_file.pages) > 0 and not pdf_file.is_encrypted
            
        except Exception as e:
            logger.error(f"PDF validation failed: {e}")
            return False
