from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


class Organization(Base):
    """Organization model - represents companies registered on the platform"""
    __tablename__ = "organization"
    
    org_id = Column(Integer, primary_key=True, autoincrement=True)
    org_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    phone_number = Column(String(20))
    address = Column(Text)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    supplies = relationship("OrganizationSupply", back_populates="organization")
    demands = relationship("OrganizationDemand", back_populates="organization")


class OrganizationSupply(Base):
    """Organization Supply model - waste materials available from organizations"""
    __tablename__ = "organization_supply"
    
    supply_id = Column(Integer, primary_key=True, autoincrement=True)
    org_id = Column(Integer, ForeignKey("organization.org_id"), nullable=False)
    category_id = Column(Integer, nullable=False)
    item_name = Column(String(255), nullable=False)
    item_description = Column(Text)
    price_per_unit = Column(Float)  # Added for matching
    unit = Column(String(50))  # e.g., "ton", "kg", "m3"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    organization = relationship("Organization", back_populates="supplies")


class OrganizationDemand(Base):
    """Organization Demand model - materials needed by organizations"""
    __tablename__ = "organization_demand"
    
    demand_id = Column(Integer, primary_key=True, autoincrement=True)
    org_id = Column(Integer, ForeignKey("organization.org_id"), nullable=False)
    category_id = Column(Integer, nullable=False)
    item_name = Column(String(255), nullable=False)
    item_description = Column(Text)
    max_price_per_unit = Column(Float)  # Added for matching
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    search_radius = Column(Float, nullable=False)  # in kilometers
    search_time = Column(DateTime)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    organization = relationship("Organization", back_populates="demands")
