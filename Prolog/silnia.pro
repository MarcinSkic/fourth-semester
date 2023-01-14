silnia(1,1) :- !.
silnia(0,1) :- !.
silnia(N,X) :- N > 1,N1 is N-1,silnia(N1,X1),X is X1*N.

silnia2(N,X) :- silnia2(0,1,N,X).
silnia2(N,X,N,X) :- !.
silnia2(N1,X1,N,X) :- N2 is N1+1,X2 is X1*N2,silnia2(N2,X2,N,X).
