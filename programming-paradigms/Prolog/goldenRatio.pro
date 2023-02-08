fibBU(N,X) :- fibBU(0,0,1,N,X).
fibBU(N,X,_,N,X) :- !.
fibBU(N1,X1,X2,N,X) :- N2 is N1+1, X3 is X1+X2,fibBU(N2,X2,X3,N,X).

goldR(N,X) :- fibBU(N,X2),N1 is N-1,fibBU(N1,X1),X is X2/X1. %easy solution

goldR2(N,X) :- fibBU2(0,0,1,N,Y,X).
fibBU2(N,Y,_,N,Y,_) :- !.
fibBU2(N1,Y1,Y2,N,Y,X) :- N2 is N1+1, Y3 is Y1+Y2, X is Y3/Y2,fibBU2(N2,Y2,Y3,N,Y,X). %does not work
