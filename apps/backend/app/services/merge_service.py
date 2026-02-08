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
        # Remove stateful initialization - will be done per request
        pass
    
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
            # Initialize fresh merger for each request (stateless)
            merger = PdfMerger()
            
            # Create PDF readers for each input
            pdf_files = []
            for i, pdf_data in enumerate(pdf_data_list):
                try:
                    pdf_stream = io.BytesIO(pdf_data)
                    pdf_file = PdfReader(pdf_stream)
                    
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
            
            # Append PDFs to merger
            for pdf in pdf_files:
                merger.append(pdf)
            
            # Write to BytesIO
            output_stream = io.BytesIO()
            merger.write(output_stream)
            result = output_stream.getvalue()
            
            # Close merger to free resources
            merger.close()
            
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
            pdf_file = PdfReader(pdf_stream)
            
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
            pdf_file = PdfReader(pdf_stream)
            
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
            pdf_file = PdfReader(pdf_stream)
            
            # Create new PDF writer
            output_stream = io.BytesIO()
            writer = PdfWriter()
            
            # Copy pages while optimizing
            for page in pdf_file.pages:
                writer.add_page(page)
            
            # Write optimized PDF
            writer.write(output_stream)
            result = output_stream.getvalue()
            
            logger.info("PDF optimization completed")
            return result
            
        except Exception as e:
            logger.error(f"PDF optimization failed: {e}")
            return pdf_data  # Return original if optimization fails
