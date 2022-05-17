myProduct x = foldr (*) 1 x

isUpperCase x = elem x ['A'..'Z']

isLowerCase x = elem x ['a'..'z']

rmUpper x = filter isLowerCase x

squareTriangles = [ (a,b,c) | c <- [0..20], b <- [0..20], a <- [0..20],c+a>b && c+b>a && a+b>c && a*a + b*b == c*c]

evenProduct = filter (\x -> x `mod` 2 == 0) [1..20]

squaresOfNumbersByWhere = map func [0..20] where
    func x = x*x

squaresOfNumbersByLambda = map (\x -> x*x) [0..20]

dividableBy3829_Standard = last (filter (\x -> x `mod` 3829 == 0) [1..1000000])


dividableBy3829_Lazy = head (filter (\x -> x `mod` 3829 == 0) (reverse [1..1000000]))

getOddSquares = length (takeWhile (<10000)  (map (\x -> x*x) [1..]))