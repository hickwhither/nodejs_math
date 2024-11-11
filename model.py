import math
import random

class Number:
    num: int
    den: int

    def __init__(self, *val) -> None:
        if not len(val):
            self.num = 0
            self.den = 1
            return
        
        if len(val) == 1:
            if isinstance(val, int):
                self.num = val
                self.den = 1
            if isinstance(val, float):
                self.num = val
                self.den = 1
                while int(self.num) != self.num:
                    self.num *= 10
                    self.den *= 10
            if isinstance(val, Number):
                self=val
            return
        
        if len(val) == 2:
            self.num = val[0]
            self.den = val[1]
            if val[1]==0: raise ZeroDivisionError("the Denominator cannot be 0")
            return
        
        raise TypeError("args exception")
    
    @classmethod
    def random(cls):
        return cls(random.randint(-999, 999), random.randint(-999, 999))

    def __simplify__(self) -> None:
        gcd = math.gcd(self.num, self.den)
        self.num //= gcd
        self.den //= gcd

    def __add__(self, other):
        other = Number(other)
        self.num = self.num * other.den + other.num * self.den
        self.den *= other.den
        self.__simplify__()
        return self
    
    def __sub__(self, other):
        other = Number(other)
        self.num = self.num * other.den - other.num * self.den
        self.den *= other.den
        self.__simplify__()
        return self
    
    def __mul__(self, other):
        other = Number(other)
        self.num *= other.num
        self.den *= other.den
        self.__simplify__()
        return self

    def __truediv__(self, val):
        other = Number(other)
        self.num *= other.den
        self.den *= other.num
        self.__simplify__()
        return self

    def __pow__(self, other):
        # Only accept integer
        if not isinstance(other, int): raise TypeError("Only accept integer type for 'other'")
        self.num **= other
        self.den **= other
        self.__simplify__()
        return self
    
    def __repr__(self) -> str:
        return f"{self.num}/{self.den}"


class Summed:
    val: int
    exp: int
    
    def __init__(self, val:int = 0, exp:int = 0):
        self.val = Number(val)
        self.exp = exp

class Expression:
    x: list
    
    def __init__(self):
        self.x = [Summed() for i in range(20)]
    
    def __add__(self, v) -> None:
        if isinstance(v, int):
            self.x[0] += v
            return
        if isinstance(v, Expression):
            for i in range(20):
                self.x[i] += v.x[i]
        
        
