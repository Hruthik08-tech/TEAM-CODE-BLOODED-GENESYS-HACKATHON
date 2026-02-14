"""
Semantic Search Module for Waste Exchange Matching

This module uses sentence transformers to understand semantic similarity
between item names, so "rice" can match "basmati rice", "jasmine rice", etc.
"""

from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Tuple
import os

class SemanticMatcher:
    """
    Handles semantic matching using sentence embeddings.
    Uses a pre-trained model to understand meaning beyond exact text matching.
    """
    
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        """
        Initialize the semantic matcher.
        
        Args:
            model_name: Name of the sentence-transformers model to use.
                       'all-MiniLM-L6-v2' is fast and works well for short texts.
        """
        print(f"Loading semantic search model: {model_name}")
        self.model = SentenceTransformer(model_name)
        print("✓ Semantic search model loaded successfully")
    
    def get_embedding(self, text: str) -> np.ndarray:
        """
        Convert text to a semantic embedding vector.
        
        Args:
            text: The text to embed
        
        Returns:
            Numpy array representing the text's meaning
        """
        if not text or not text.strip():
            # Return zero vector for empty text
            return np.zeros(self.model.get_sentence_embedding_dimension())
        
        # Normalize text
        text = text.lower().strip()
        
        # Get embedding
        embedding = self.model.encode(text, convert_to_numpy=True)
        return embedding
    
    def cosine_similarity(self, vec1: np.ndarray, vec2: np.ndarray) -> float:
        """
        Calculate cosine similarity between two vectors.
        
        Args:
            vec1: First vector
            vec2: Second vector
        
        Returns:
            Similarity score between 0 and 1 (1 = identical meaning)
        """
        # Avoid division by zero
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        # Calculate cosine similarity
        similarity = np.dot(vec1, vec2) / (norm1 * norm2)
        
        # Clip to [0, 1] range
        similarity = max(0.0, min(1.0, similarity))
        
        return float(similarity)
    
    def calculate_similarity(self, text1: str, text2: str) -> float:
        """
        Calculate semantic similarity between two texts.
        
        This understands that:
        - "rice" is similar to "basmati rice"
        - "wood chips" is similar to "wood sawdust"
        - "organic waste" is similar to "food waste"
        
        Args:
            text1: First text
            text2: Second text
        
        Returns:
            Similarity score between 0 and 1
        """
        # Get embeddings
        emb1 = self.get_embedding(text1)
        emb2 = self.get_embedding(text2)
        
        # Calculate similarity
        similarity = self.cosine_similarity(emb1, emb2)
        
        return similarity
    
    def batch_similarity(
        self, 
        query: str, 
        candidates: List[str]
    ) -> List[Tuple[str, float]]:
        """
        Calculate similarity between query and multiple candidates efficiently.
        
        Args:
            query: The search query
            candidates: List of candidate texts to match against
        
        Returns:
            List of (candidate, similarity_score) tuples, sorted by score
        """
        if not candidates:
            return []
        
        # Get query embedding
        query_emb = self.get_embedding(query)
        
        # Get all candidate embeddings at once (more efficient)
        candidate_embs = self.model.encode(
            [c.lower().strip() for c in candidates],
            convert_to_numpy=True,
            show_progress_bar=False
        )
        
        # Calculate similarities
        results = []
        for candidate, candidate_emb in zip(candidates, candidate_embs):
            similarity = self.cosine_similarity(query_emb, candidate_emb)
            results.append((candidate, similarity))
        
        # Sort by similarity (highest first)
        results.sort(key=lambda x: x[1], reverse=True)
        
        return results


# Global instance (lazy loaded)
_semantic_matcher = None


def get_semantic_matcher() -> SemanticMatcher:
    """
    Get or create the global semantic matcher instance.
    
    The model is loaded only once and reused for efficiency.
    """
    global _semantic_matcher
    
    if _semantic_matcher is None:
        _semantic_matcher = SemanticMatcher()
    
    return _semantic_matcher


def calculate_semantic_similarity(text1: str, text2: str) -> float:
    """
    Convenience function to calculate semantic similarity.
    
    Example:
        >>> similarity = calculate_semantic_similarity("rice", "basmati rice")
        >>> print(similarity)  # ~0.85
    
    Args:
        text1: First text
        text2: Second text
    
    Returns:
        Similarity score between 0 and 1
    """
    matcher = get_semantic_matcher()
    return matcher.calculate_similarity(text1, text2)
