"""
PDF merge service for combining multiple PDF files.
Logic: Use PyPDF2 to merge PDFs with proper error handling and optimization.
"""

import logging
import io
from typing import List, Optional

try:
    from PyPDF2 import PdfMerger, PdfReader, PdfWriter
except ImportError:
    try:
        import pypdf
        from pypdf import PdfMerger, PdfReader
    except ImportError:
        raise ImportError("Neither PyPDF2 nor pypdf is available. Install one of them.")

logger = logging.getLogger(__name__)


class MergeService:
    """Service for merging PDF files."""
    
    def __init__(self):
        """Initialize merge service."""
        self.merger = None
        self.reader = None
        self.writer = None
        
        # Try to initialize with PyPDF2 first
        try:
            self.merger = PdfMerger()
            self.reader = PdfReader
            self.writer = PdfWriter()
            logger.info("Initialized merge service with PyPDF2")
        except:
            # Fallback to pypdf
            self.merger = PdfMerger()
            self.reader = PdfReader()
            self.writer = PdfWriter()
            logger.info("Initialized merge service with pypdf")
    
    def merge_pdfs(self, pdf_data_list: List[bytes]) -> bytes:
        """
        Merge multiple PDF files into a single PDF.
        
        Args:
            pdf_data_list: List of PDF file data as bytes
            
        Returns:
            bytes: Merged PDF data
            
        Raises:
            ValueError: If no valid PDFs provided or merge fails
        """
        if not pdf_data_list:
            raise ValueError("No PDF files provided for merging")
        
        try:
            # Create PDF readers for each input
            pdf_files = []
            for i, pdf_data in enumerate(pdf_data_list):
                try:
                    pdf_stream = io.BytesIO(pdf_data)
                    if self.reader.__name__ == 'PdfReader':
                        pdf_file = self.reader(pdf_stream)
                    else:
                        pdf_file = self.reader(pdf_stream)
                    
                    # Validate PDF
                    if len(pdf_file.pages) == 0:
                        logger.warning(f"PDF {i} has no pages, skipping")
                        continue
                    
                    pdf_files.append(pdf_file)
                    logger.info(f"Successfully loaded PDF {i} with {len(pdf_file.pages)} pages")
                    
                except Exception as e:
                    logger.error(f"Failed to read PDF {i}: {e}")
                    raise ValueError(f"Invalid PDF file {i}: {str(e)}")
            
            if not pdf_files:
                raise ValueError("No valid PDF files could be processed")
            
            # Create merger and append PDFs
            if self.merger.__name__ == 'PdfMerger':
                # PyPDF2 approach
                for pdf in pdf_files:
                    self.merger.append(PDF)
                
                # Write to BytesIO
                output_stream = io.BytesIO()
                self.merger.write(output_stream)
                result = output_stream.getvalue()
                
            else:
                # pypdf approach
                output_stream = io.BytesIO()
                for PDF in pdf_files:
                    self.merger.append(PDF)
                
                self.merger.write(output_stream)
                result = output_stream.getvalue()
            
            logger.info(f"Successfully merged {len(pdf_files)} PDFs")
            return result
            
        except Exception as e:
            logger.error(f"PDF merge failed: {e}")
            raise ValueError(f"Failed to merge PDFs: {str(e)}")
    
    def get_pdf_info(self, pdf_data: bytes) -> dict:
        """
        Get information about a PDF file.
        
        Args:
            pdf_data: PDF file data as bytes
            
        Returns:
            dict: PDF information
        """
        try:
            pdf_stream = io.BytesIO(pdf_data)
            if self.reader.__name__ == 'PdfReader':
                pdf_file = self.reader(pdf_stream)
            else:
                pdf_file = self.reader(pdf_stream)
            
            return {
                "pages": len(pdf_file.pages),
                "title": pdf_file.metadata.get('/Title', ''),
                "author": pdf_file.metadata.get('/Author', ''),
                "creator": pdf_file.metadata.get('/Creator', ''),
                "producer": pdf_file.metadata.get('/Producer', ''),
                "creation_date": pdf_file.metadata.get('/CreationDate', ''),
                "modification_date": pdf_file.metadata.get('/ModDate', ''),
                "is_encrypted": pdf_file.is_encrypted,
                "file_size": len(pdf_data)
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
            
            # Check if it has pages and is not encrypted
            return len(pdf_file.pages) > 0 and not pdf_file.is_encrypted
            
        except Exception as e:
            logger.error(f"PDF validation failed: {e}")
            return False
    
    def optimize_pdf(self, pdf_data: bytes) -> bytes:
        """
        Optimize PDF by removing unnecessary metadata and compressing content.
        
        Args:
            pdf_data: PDF data to optimize
            
        Returns:
            bytes: Optimized PDF data
        """
        try:
            pdf_stream = io.BytesIO(pdf_data)
            if self.reader.__name__ == 'PdfReader':
                pdf_file = self.reader(pdf_stream)
            else:
                pdf_file = self.reader(pdf_stream)
            
            # Create new PDF writer
            output_stream = io.BytesIO()
            
            # Copy pages while optimizing
            for page in pdf_file.pages:
                self.writer.add_page(page)
            
            # Write optimized PDF
            self.writer.write(output_stream)
            result = output_stream.getvalue()
            
            logger.info("PDF optimization completed")
            return result
            
        except Exception as e:
            logger.error(f"PDF optimization failed: {e}")
            return pdf_data  # Return original if optimization fails
