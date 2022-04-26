changeSymbol x = if x <= 0 then abs x else -x

sqrtNatural x = sqrt(if x > 0 then x else error "negative number")

delta a b c = b^2 - 4*a*c

pdelta :: Double -> Double -> Double -> Double 
pdelta a b c = if delt >= 0 then sqrt delt else error "Zła delta" where
    delt = delta a b c

equationResults a b c = if a == 0 then error "To nie kwadratowa" else [x1,x2] where
    x1 = (-b - pdelta a b c)/(2*a)
    x2 = (-b + pdelta a b c)/(2*a)