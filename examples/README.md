# Query-Master Examples

This directory contains real-world examples of Query-Master usage.

## Running Examples

```bash
# Run the CLI
npm start

# Or with debugging
npm run dev
```

## Example 1: Student Grade Analysis

Analyze student performance by grade level:

```sql
SELECT grade, COUNT(*) as student_count, AVG(score) as avg_score 
FROM student 
GROUP BY grade 
ORDER BY avg_score DESC;
```

Check `student.csv` for sample data.

## Example 2: Course Enrollment Statistics

Count enrollments per course:

```sql
SELECT c.course_name, COUNT(e.student_id) as enrollment_count
FROM courses c
LEFT JOIN enrollment e ON c.course_id = e.course_id
GROUP BY c.course_name
ORDER BY enrollment_count DESC;
```

## Example 3: Advanced Filtering

Find students above a certain age with specific grades:

```sql
SELECT name, age, grade 
FROM student 
WHERE age > 20 AND grade IN ('A', 'B')
ORDER BY age DESC
LIMIT 10;
```

## Example 4: Data Modification

Insert a new student:

```sql
INSERT INTO student (id, name, age, grade) VALUES (101, 'John Doe', 21, 'A');
```

Update grades:

```sql
UPDATE student SET grade = 'A' WHERE score > 90;
```

Delete duplicate records:

```sql
DELETE FROM student WHERE age < 18;
```

## Example 5: Complex Joins

Get complete enrollment data:

```sql
SELECT s.name, c.course_name, e.enrollment_date
FROM student s
INNER JOIN enrollment e ON s.id = e.student_id
INNER JOIN courses c ON e.course_id = c.course_id
WHERE s.grade = 'A'
ORDER BY c.course_name;
```

## Tips

- Use `--help` for CLI help
- Enable debug mode with `npm run dev`
- Check logs in `logs/` folder
- Schemas are stored in `schemas/` folder
