import csv
import json

def convert_puzzles(input_file, output_file, max_puzzles=1000):
    puzzles = []
    with open(input_file, 'r') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            if i >= max_puzzles:
                break
                
            puzzle = {
                'id': row['PuzzleId'],
                'fen': row['FEN'],
                'moves': row['Moves'].split(),
                'rating': int(row['Rating']),
                'themes': row['Themes'].split(),
                'popularity': int(row['Popularity'])
            }
            puzzles.append(puzzle)
    
    puzzles.sort(key=lambda x: x['popularity'], reverse=True)
    
    with open(output_file, 'w') as f:
        json.dump({'puzzles': puzzles}, f, indent=2)

if __name__ == '__main__':
    convert_puzzles('lichess_db_puzzle.csv', 'puzzles.json')