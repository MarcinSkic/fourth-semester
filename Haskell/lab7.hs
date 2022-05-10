sign1 x = if x > 0 then 1 else if x < 0 then -1 else 0

sign2 x
    | x > 0 = 1
    | x == 0 = 0
    | x < 0 = -1

myComp a b
    | a < b = LT
    | a > b = GT
    | otherwise = EQ

mulMine a b 
    | a < 0 = mulNegative a b
    | a == 0 = 0
    | a == 1 = b
    | otherwise = b + mulMine (a-1) b

mulNegative a b
    | b < 0 = mulInvert a b
    | b == 0 = 0
    | b == 1 = a
    | otherwise = a + mulNegative a (b-1)

mulInvert a b = mulMine ((-1)*a) ((-1)*b)

factorial a
    | a < 0 = error "ZIOMECZKU"
    | a == 0 = 1
    | otherwise = a * factorial (a-1)

factorial2 a = if a < 0 then error "ZIOMECZKU" else
    if a == 0
        then 1
        else a * factorial2 (a-1)

fibonacci a = fibonacciHelper 0 0 1 a

fibonacciHelper counter x1 x2 a
    | counter == a = x1
    | otherwise = fibonacciHelper (counter+1) x2 (x1+x2) a